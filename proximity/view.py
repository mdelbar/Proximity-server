from flask import jsonify, abort, make_response, request
from proximity import app, user_controller

""" View handles routing and minor JSON mapping. Delegates to controllers for actual logic. """

""" Test DB methods """

@app.route('/users/load', methods=['GET'])
def load_users():
    return jsonify({'users': user_controller.load_users()})
    

@app.route('/users', methods=['GET'])
def get_all_users():
    return jsonify({'users': user_controller.find_all_users()})


""" GET Methods """

""" Get a user based on their UserID """
@app.route('/users/<int:uid>', methods=['GET'])
def get_user(uid):
    user = user_controller.find_user(uid)
    if user == None:
        """ User not found """
        abort(404)
    return jsonify({'user': user})


""" Find all users near a user. For the web app, near means within 1km. """
@app.route('/users_near/<int:uid>', methods=['GET'])
def get_users_near(uid):
    users = user_controller.find_users_near(uid)
    if users == None:
        """ User not found """
        abort(404)
    
    """ TODO: To protect privacy from the web app (non-mobile), add some fuzz to actual locations of users. """
    
    return jsonify({'users': users})


""" POST Methods """

@app.route('/users', methods=['POST'])
def create_user():
    if not request.json:
        abort(400)
        
    user = {
        'name': request.json['name'],
        'age': request.json['age'],
        'gender': request.json['gender'],
        'looking_for_m': request.json['looking_for_m'],
        'looking_for_f': request.json['looking_for_f'],
        'loc': request.json['loc']
    }
    
    created_user = user_controller.create_user(user)
    
    return jsonify({'user': created_user}), 201



""" PUT Methods """

@app.route('/users/<int:uid>', methods=['PUT'])
def update_user(uid):
    if not request.json:
        abort(400)
    
    updated_user = user_controller.update_user(uid, request.json)
    if updated_user == None:
        abort(404)
    
    return jsonify({'user': updated_user}), 200


""" Error handlers """

@app.errorhandler(400)
def bad_request(error):
	return make_response(jsonify({'error': 'Bad request'}), 400)

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)

  
  









