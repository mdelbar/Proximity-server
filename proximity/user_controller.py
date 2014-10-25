from proximity import data
from copy import deepcopy
import hashlib

""" User-related controller methods """

""" Find all users """
def find_all_users():
    users = data.get_users()
    for u in users:
        u['loc'] = geo2d_to_coords(u['loc'])
    return users

""" Find a user via their UserID """
def find_user(uid):
    user = data.find_user(uid)
    user['loc'] = geo2d_to_coords(user['loc'])
    return user


""" Find all users near a user (based on UserID) """
def find_users_near(uid):
    user = find_user(uid)
    if user == None:
        return None
    
    users_near = data.find_users_near(user['loc'][0], user['loc'][1], 1000)
    
    for u in users_near:
        u['loc'] = geo2d_to_coords(u['loc'])
    
    return users_near


""" Create a new user. Takes user dictionary with info and returns a copy with the UserID filled in. """
def create_user(user):
    user_copy = deepcopy(user)
    user['loc'] = coords_to_geo2d(user['loc'])
    uid = data.create_user(user)
    user_copy['uid'] = uid
    return user_copy


""" Update an existing user. Returns None if no user is found for this UserID. """
def update_user(uid, user):
    """ Ensure that the UserID is never updated by taking it out of the document before passing along """
    if 'uid' in user:
        del user['uid']
    
    user['loc'] = coords_to_geo2d(user['loc'])
    data.update_user(uid, user)
    """ Will return None if no user for this UserID """
    return find_user(uid)


""" Helper methods """

""" Transform coordinates array to a GeoJSON format. """
def coords_to_geo2d(coords):
    return {'type': 'Point', 'coordinates': deepcopy(coords)}


""" Transform GeoJSON format to coordinates array. """
def geo2d_to_coords(geo2d):
    return deepcopy(geo2d['coordinates'])


""" Make a hash of a string. """
def calc_hash(s):
    hash_obj = hashlib.sha256(s.encode())
    return hash_obj.hexdigest()



""" Test method to load some initial users into the DB """
def load_users():
    data.clear_db()
    data.init_db()
    data.create_user({
        'name': u'TestUser1',
        'pass': calc_hash('pass1'),
        'age': 21,
        'gender': 'm',
        'looking_for_m': 0,
        'looking_for_f': 1,
        'loc': coords_to_geo2d([51.01,3.91])
    })
    data.create_user({
        'name': u'TestUser2',
        'pass': calc_hash('pass2'),
        'age': 22,
        'gender': 'f',
        'looking_for_m': 1,
        'looking_for_f': 0,
        'loc': coords_to_geo2d([51.02,3.92])
    })
    data.create_user({
        'name': u'TestUser3',
        'pass': calc_hash('pass3'),
        'age': 23,
        'gender': 'm',
        'looking_for_m': 1,
        'looking_for_f': 1,
        'loc': coords_to_geo2d([51.03,3.93])
    })
    
    loaded_users = data.get_users()
    
    for u in loaded_users:
        u['loc'] = geo2d_to_coords(u['loc'])
    
    return loaded_users













