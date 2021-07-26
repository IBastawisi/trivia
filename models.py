import os
import re
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

database_filename = "database.db"
database_path = "sqlite:///{}".format(os.path.join(basedir, database_filename))

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''
def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    if not os.path.isfile(database_filename):
        db.create_all()
        insert_initial_data()


def insert_initial_data():
    engine = create_engine(database_path)
    with open('script.sql') as file:
        statements = re.split(r';\s*$', file.read(), flags=re.MULTILINE)
        for statement in statements:
            if statement:
                engine.execute(statement)


'''
Question

'''
class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    question = Column(String)
    answer = Column(String)
    category = Column(String)
    difficulty = Column(Integer)

    def __init__(self, question, answer, category, difficulty):
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


'''
Category

'''
class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    type = Column(String)

    def __init__(self, type):
        self.type = type

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
