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
  winner = db.StringProperty()

class GameUpdater():
  game = None

  def __init__(self, game):
    self.game = game

  def get_game_message(self):
    gameUpdate = {
      'userA': self.game.userA.user_id(),
      'userB': '' if not self.game.userB else self.game.userB.user_id(),
      'winner': self.game.winner,
    }

    return json.dumps(gameUpdate)

  def send_update(self):
    message = self.get_game_message()
    channel.send_message(self.game.userA.user_id() + self.game.key().id_or_name(), message)
    if self.game.userB:
      channel.send_message(self.game.userB.user_id() + self.game.key().id_or_name(), message)

  def check_win(self):
    return

  def make_move(self, position, user):
    if position >= 0 and user == self.game.userX or user == self.game.userO:
      if self.game.moveX == (user == self.game.userX):
        boardList = list(self.game.board)
        if (boardList[position] == ' '):
          boardList[position] = 'X' if self.game.moveX else 'O'
          self.game.board = "".join(boardList)
          self.game.moveX = not self.game.moveX
          self.check_win()
          self.game.put()
          self.send_update()
          return

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
                path = os.path.join(os.path.dirname(__file__), 'game_test.html')

                self.response.out.write(template.render(path, template_values))
            else:
                self.response.out.write('No such game')
        else:
            self.redirect(users.create_login_url(self.request.uri))


app = webapp2.WSGIApplication([
    ('/', IntroPage),
    ('/game', MainPage),
    ('/opened', OpenedPage),
])