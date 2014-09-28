from flask import jsonify, abort, make_response, request
from proximity import app

users = [
    {
        'id': 1,
        'name': u'TestUser1',
        'age': 21,
        'sex': 'm',
        'looking_for': 'm,f',
        'lat': 51.01, 
        'long': 3.91
    },
    {
        'id': 2,
        'name': u'TestUser2',
        'age': 22,
        'sex': 'm',
        'looking_for': 'f',
        'lat': 51.02, 
        'long': 3.92
    },
    {
        'id': 3,
        'name': u'TestUser3',
        'age': 23,
        'sex': 'f',
        'looking_for': 'm',
        'lat': 51.03, 
        'long': 3.93
    }
]


""" Main logic methods """

def get_user_for_id(user_id):
    users_filtered = filter(lambda u: u['id'] == user_id, users)
    if len(users_filtered) == 0:
        abort(404)
    return users_filtered[0]


""" GET Methods """

""" Get all users currently in the database """
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify({'users': users})

""" Get a user based on their ID """
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
	user = get_user_for_id(user_id)
	return jsonify({'user': user})

@app.route('/users_near/<int:user_id>', methods=['GET'])
def get_users_near(user_id):
    user = get_user_for_id(user_id)
    
    """ Right now 'near' means within a certain degree, for easier testing.
    Later this should be a distance (param) transformed to degree """
    lat_min = user['lat'] - 0.015
    lat_max = user['lat'] + 0.015
    long_min = user['long'] - 0.015
    long_max = user['long'] + 0.015
    """print("user_id: %s, user[id]: %s, lat_min: %s, lat_max: %s, long_min: %s, long_max: %s" % (user_id, user['id'], lat_min, lat_max, long_min, long_max))"""
    
    """ Filter everything that doesn't fit in the lat/long range, and filter out the own user as well """
    users_near = filter(
        lambda u: (u['id'] != user_id)
        and (lat_min <= u['lat'] <= lat_max)
        and (long_min <= u['long'] <= long_max)
    , users)
    
    return jsonify({'users': users_near})


""" POST Methods """
@app.route('/users', methods=['POST'])
def create_user():
    if not request.json:
        abort(400)
        
    user = {
        'id': users[-1]['id'] + 1,
        'name': request.json['name'],
        'age': request.json['age'],
        'sex': request.json['sex'],
        'looking_for': request.json['looking_for'],
        'lat': request.json['lat'],
        'long': request.json['long']
    }
    users.append(user)
    return jsonify({'user': user}), 201


""" PUT Methods """
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    if not request.json:
        abort(400)
    
    user = get_user_for_id(user_id)
    user['name'] = request.json['name']
    user['age'] = request.json['age']
    user['sex'] = request.json['sex']
    user['looking_for'] = request.json['looking_for']
    user['lat'] = request.json['lat']
    user['long'] = request.json['long']
    
    return jsonify({'user': user}), 200


""" Error handlers """
@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)