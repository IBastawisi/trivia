import os
from flask import Flask, request, abort, jsonify, send_from_directory
from sqlalchemy import func
from flask_cors import CORS

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10

def paginate_questions(request, selection):
    page = request.args.get('page', 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    questions = [question.as_dict() for question in selection]
    current_questions = questions[start:end]

    return current_questions


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, static_url_path='', static_folder='client/build')
    setup_db(app)
    
    # Set up CORS.
    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # GET all categories
    @app.route('/categories')
    def retrieve_categories():
        categories = Category.query.all()
        return jsonify({
            'success': True,
            'categories': [category.as_dict() for category in categories],
        })

    # GET questions with pagination
    @app.route('/questions')
    def retrieve_questions():
        page = request.args.get('page', 1, type=int)
        selection = Question.query.order_by(Question.id).all()
        current_questions = paginate_questions(request, selection)

        categories = Category.query.all()

        if len(current_questions) == 0:
            abort(404)

        return jsonify({
            'success': True,
            'questions': current_questions,
            'total_questions': len(selection),
            'categories': [category.as_dict() for category in categories],
            'current_category': 0,
            'page': page
        })

    # DELETE question using a question ID.
    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        try:
            question = Question.query.filter(
                Question.id == question_id).one_or_none()

            if question is None:
                abort(404)

            question.delete()
            selection = Question.query.order_by(Question.id).all()
            current_questions = paginate_questions(request, selection)

            return jsonify({
                'success': True,
                'deleted': question_id,
                'questions': current_questions,
                'total_questions': len(question.query.all())
            })

        except:
            abort(422)

    # POST a new question,
    @app.route('/questions', methods=['POST'])
    def create_question():
        body = request.get_json()

        try:
            question = Question(**body)
            question.insert()

            selection = Question.query.order_by(Question.id).all()
            current_questions = paginate_questions(request, selection)

            return jsonify({
                'success': True,
                'created': question.id,
                'questions': current_questions,
                'total_questions': len(question.query.all())
            })

        except:
            abort(422)

    # POST endpoint to get questions based on a search term.
    @app.route('/questions/search', methods=['POST'])
    def search_questions():
        body = request.get_json()

        try:
            searchTerm = body.get("searchTerm")
            questions = Question.query.filter(Question.question.ilike(
                f"%{searchTerm}%")).order_by(Question.id).limit(10).all()
            return jsonify({
                'success': True,
                'questions': [question.as_dict() for question in questions],
                'total_questions': len(questions),
                'current_category': 0,
            })
        except:
            abort(422)

    # GET endpoint to get questions based on category.
    @app.route('/categories/<category_id>/questions')
    def retrieve_category_questions(category_id):
        page = request.args.get('page', 1, type=int)

        try:
            if category_id == '0':
                selection = Question.query.order_by(Question.id).all()
            else:
                selection = Question.query.filter(
                    Question.category == category_id).order_by(Question.id).all()

            current_questions = paginate_questions(request, selection)

            categories = Category.query.all()

            if len(current_questions) == 0:
                abort(404)

            return jsonify({
                'success': True,
                'questions': current_questions,
                'total_questions': len(selection),
                'categories': [category.as_dict() for category in categories],
                'current_category': category_id,
                'page': page
            })
        except:
            abort(422)

    # POST endpoint to get questions to play the quiz.
    @app.route('/quizzes', methods=['POST'])
    def get_quizze():
        body = request.get_json()
        category_id = body.get("category_id") or '0'
        previous_questions = body.get("previous_questions") or []

        try:
            if category_id == '0':
                question = Question.query.filter(Question.id.notin_(
                    previous_questions)).order_by(func.random()).first()
            else:
                question = Question.query.filter(
                    Question.category == category_id, Question.id.notin_(previous_questions)).order_by(func.random()).first()

            if question is not None:
                question = question.as_dict()
            return jsonify({
                'success': True,
                'question': question
            })
        
        except:
            abort(422)


    @app.route("/", defaults={'path':''})
    def serve(path):
        return send_from_directory(app.static_folder, 'index.html')

    # Error handlers for all expected errors
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": "resource not found"
        }), 404

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "unprocessable"
        }), 422

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "bad request"
        }), 400

    return app
