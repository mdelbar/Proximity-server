from proximity import data
from copy import deepcopy
import hashlib
import random

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
    if user != None:
        user['loc'] = geo2d_to_coords(user['loc'])
    return user


""" Find all users near a user (based on UserID) """
def find_users_near(uid):
    user = find_user(uid)
    if user == None:
        return None
    
    users_near = data.find_users_near(user['loc'][0], user['loc'][1], 2000)
    
    """ Filter out own user """
    users_near = filter(lambda u: u['uid'] != uid, users_near)
    
    for u in users_near:
        u['loc'] = geo2d_to_coords(u['loc'])
    
    return users_near


""" Create a new user. Takes user dictionary with info and returns a copy with the UserID filled in. """
def create_user(user):
    user['loc'] = coords_to_geo2d(user['loc'])
    if 'pass' in user:
        user['pass'] = calc_hash(user['pass'])
    uid = data.create_or_update_user(user)
    """ Return a find_user result to ensure that only non-sensitive user data is returned. """
    return find_user(uid)


""" Update an existing user. Returns None if no user is found for this UserID. """
def update_user(uid, user):
    user['loc'] = coords_to_geo2d(user['loc'])
    data.create_or_update_user(uid, user)
    """ Will return None if no user for this UserID """
    return find_user(uid)


""" Helper methods """

""" Transform coordinates array to a GeoJSON format. """
def coords_to_geo2d(coords):
    return {'type': 'Point', 'coordinates': deepcopy(coords)}


""" Transform GeoJSON format to coordinates array. """
def geo2d_to_coords(geo2d):
    return deepcopy(geo2d['coordinates'])


""" Make a SHA-256 hash of a string. """
def calc_hash(s):
    hash_obj = hashlib.sha256(s.encode())
    return hash_obj.hexdigest()



""" Test method to load some initial users into the DB """
def load_users():
    data.clear_db()
    data.init_db()
    
    """ Create some users near me (Belgium) """
    for i in range(1,10):
        """ Generate random lat/long within boundaries"""
        lt = 51.00 + (random.random() / 100.0 * random.choice([1,(-1)]))
        ln = 3.92 + (random.random() / 100.0 * random.choice([1,(-1)]))
        data.create_user({
            'name': u'TestUser%s' % (i),
            'pass': calc_hash('pass%s' % (i)),
            'age': 20 + i,
            'gender': random.choice(['m','f']),
            'looking_for_m': random.choice([0,1]),
            'looking_for_f': random.choice([0,1]),
            'loc': coords_to_geo2d([ln,lt])
        })
    
    
    """ Create some users near Uber (San Francisco) """
    for i in range(11,20):
        """ Generate random lat/long within boundaries"""
        lt = 37.79 + (random.random() / 100.0 * random.choice([1,(-1)]))
        ln = (-122.39) + (random.random() / 100.0 * random.choice([1,(-1)]))
        data.create_user({
            'name': u'TestUser%s' % (i),
            'pass': calc_hash('pass%s' % (i)),
            'age': 20 + i,
            'gender': random.choice(['m','f']),
            'looking_for_m': random.choice([0,1]),
            'looking_for_f': random.choice([0,1]),
            'loc': coords_to_geo2d([ln,lt])
        })
    
    loaded_users = data.get_users()
    
    for u in loaded_users:
        u['loc'] = geo2d_to_coords(u['loc'])
    
    return loaded_users













