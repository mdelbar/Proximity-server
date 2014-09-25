from flask import jsonify, abort, make_response, request
from proximity import app

users = [
    {
        'id': 1,
        'name': u'Jos',
        'age': 23,
        'lat': 51.0, 
        'long': 3.5
    },
    {
        'id': 2,
        'name': u'Jef',
        'age': 23,
        'lat': 52.0, 
        'long': 4.0
    }
]

""" GET Methods """
@app.route('/users', methods=['GET'])
def get_tasks():
    return jsonify({'users': users})

@app.route('/users/<int:user_id>', methods=['GET'])
def get_task(user_id):
	user = filter(lambda t: t['id'] == user_id, users)
	if len(user) == 0:
		abort(404)
	return jsonify({'user': user[0]})

""" POST Methods """
# @app.route('/users', methods=['POST'])
def create_task():
    if not request.json or not 'name' in request.json:
        abort(400)
    user = {
        'id': users[-1]['id'] + 1,
        'name': request.json['name'],
        'lat': request.json['lat'],
        'long': request.json['long']
    }
    users.append(user)
    return jsonify({'user': user}), 201

""" Error handlers """
@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)