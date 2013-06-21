#!/usr/bin/env python

import os
import json
import webapp2
from google.appengine.ext.webapp import template
from google.appengine.api import channel
from google.appengine.api import users
from google.appengine.ext import db


class Game(db.Model):
  """All the data we store for a game"""
  userA = db.UserProperty()
  userB = db.UserProperty()
  userABlock = db.StringProperty()
  userBBlock = db.StringProperty()
  userAPointerIndex = db.IntegerProperty()
  userBPointerIndex = db.IntegerProperty()
  userAPowerupType = db.StringProperty()
  userBPowerupType = db.StringProperty()
  userAPowerupDuration = db.IntegerProperty()
  userBPowerupDuration = db.IntegerProperty()
  userAHealth = db.IntegerProperty()
  userBHealth = db.IntegerProperty()
  winner = db.StringProperty()

class GameUpdater():
  game = None

  def __init__(self, game):
    self.game = game

  def get_game_message(self, jsonResult = True):
    gameUpdate = {
      'userA': self.game.userA.user_id(),
      'userB': '' if not self.game.userB else self.game.userB.user_id(),
      'userABlock': self.game.userABlock,
      'userBBlock': self.game.userBBlock,
      'userAPointerIndex': self.game.userAPointerIndex,
      'userBPointerIndex': self.game.userBPointerIndex,
      'userAHealth': self.game.userAHealth,
      'userBHealth': self.game.userBHealth,
      'winner': self.game.winner,
    }

    if (jsonResult):
      gameUpdate = json.dumps(gameUpdate)

    return gameUpdate

  def send_update(self):
    message = self.get_game_message()
    channel.send_message(self.game.userA.user_id() + self.game.key().id_or_name(), message)
    if self.game.userB:
      channel.send_message(self.game.userB.user_id() + self.game.key().id_or_name(), message)

  def send_opp_data(self, player):
    allMessage = self.get_game_message(jsonResult = False)
    print allMessage
    print player.user_id()
    if player.user_id() == allMessage['userA']:
      message = {
        'userABlock': allMessage['userABlock'],
        'userAPointerIndex': allMessage['userAPointerIndex'],
        'userAHealth': allMessage['userAHealth']
      }
      channel.send_message(self.game.userB.user_id() + self.game.key().id_or_name(), json.dumps(message))
    else:
      message = {
        'userBBlock': allMessage['userBBlock'],
        'userBPointerIndex': allMessage['userBPointerIndex'],
        'userBHealth': allMessage['userBHealth']
      }
      channel.send_message(self.game.userA.user_id() + self.game.key().id_or_name(), json.dumps(message))

  def send_powerup(self, powerUpType, affectedUser):
    player = users.get_current_user();
    allMessage = self.get_game_message(jsonResult = False)

    print player.user_id()
    print allMessage
    print type
    print affectedUser

    message = {
      'powerUpType': powerUpType
    }

    if player.user_id() == affectedUser:
      message['powerUpTarget'] = 'opponent'
    else:
      message['powerUpTarget'] = 'you'

    if player.user_id() == allMessage['userA']:
      channel.send_message(self.game.userB.user_id() + self.game.key().id_or_name(), json.dumps(message))
    if player.user_id() == allMessage['userB']:
      channel.send_message(self.game.userA.user_id() + self.game.key().id_or_name(), json.dumps(message))

  def sync_opp_data(self, block, index, health):
    player = users.get_current_user();
    if player == self.game.userA:
      if block:
        self.game.userABlock = block
      self.game.userAPointerIndex = index
      self.game.userAHealth = health
      self.game.put()
      self.send_opp_data(player)
    elif player == self.game.userB:
      if block:
        self.game.userBBlock = block
      self.game.userBPointerIndex = index
      self.game.userBHealth = health
      self.game.put()
      self.send_opp_data(player)


class GameFromRequest():
  game = None;

  def __init__(self, request):
    user = users.get_current_user()
    game_key = request.get('g')
    if user and game_key:
      self.game = Game.get_by_key_name(game_key)

  def get_game(self):
    return self.game

class IntroPage(webapp2.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, {}))

class RulesPage(webapp2.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'rules.html')
    self.response.out.write(template.render(path, {}))

class OpenedPage(webapp2.RequestHandler):
    def post(self):
        game = GameFromRequest(self.request).get_game()
        GameUpdater(game).send_update()

class MainPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        game_key = self.request.get('g')
        game = None
        if user:
            if not game_key:
                game_key = user.user_id()
                game = Game(key_name = game_key,
                            userA = user,)
                game.put()
            else:
                game = Game.get_by_key_name(game_key)
                if not game.userB:
                    game.userB = user
                    game.put()

            game_link = 'http://localhost:8080/game?g=' + game_key

            if game:
                token = channel.create_channel(user.user_id() + game_key)
                template_values = {'token': token,
                                   'me': user.user_id(),
                                   'game_key': game_key,
                                   'game_link': game_link,
                                   'initial_message': GameUpdater(game).get_game_message()
                                   }
                print template_values
                path = os.path.join(os.path.dirname(__file__), 'game.html')

                self.response.out.write(template.render(path, template_values))
            else:
                self.response.out.write('No such game')
        else:
            self.redirect(users.create_login_url(self.request.uri))

class SyncPage(webapp2.RequestHandler):
  def post(self):
    game = GameFromRequest(self.request).get_game()
    user = users.get_current_user()
    request = json.loads(self.request.body)
    if game and user:
        GameUpdater(game).sync_opp_data(
          block = request['block'],
          index = request['index'],
          health = request['health']
          );


class PowerupPage(webapp2.RequestHandler):
  def post(self):
    game = GameFromRequest(self.request).get_game()
    user = users.get_current_user()
    request = json.loads(self.request.body)
    if game and user:
      GameUpdater(game).send_powerup(
        powerUpType = request['type'],
        affectedUser = request['user']
        ); 



app = webapp2.WSGIApplication([
    ('/', IntroPage),
    ('/rules', RulesPage),
    ('/game', MainPage),
    ('/opened', OpenedPage),
    ('/sync', SyncPage),
    ('/powerup', PowerupPage)
])