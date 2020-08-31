import bpy
import os
import json
import pprint
import math

# blender /Users/markracette/Drive/Dev/blender/projects/js13k/2020/grass.blend --background --python /Users/markracette/Drive/Dev/projects/js13k/2020/blender/export.py
# OBJECT_NAMES = ['stream_full', 'stream_side', 'stream_corner']
# OBJECT_NAMES = ['player_body','player_face_inner','player_face_outer','player_ring_front', 'player_ring_back', 'player_hands']
OBJECT_NAMES = ['shadow']
BLENDER_PROJECT_PATH = "/Users/markracette/Drive/Dev/blender/projects/js13k/2020/grass.blend"
SAVE_PATH = "/Users/markracette/Drive/Dev/projects/js13k/2020/src/blender/raw"

for name in OBJECT_NAMES:

    mesh = bpy.data.objects[name]
    polygons = mesh.data.polygons
    vertices = mesh.data.vertices

    geometry = {
        'name': name,
        'faces': [],
        'vertices': [],
        'normals': [],
    }

    for p in polygons:
        (x, y, z) = p.normal
        radius = math.sqrt(x * x + y * y + z * z)
        if abs(round(x, 2)) == 0 and abs(round(y, 2)) == 0:
            theta = 0
        else:
            theta = round(math.atan2(y, x), 2)
        phi = round(math.acos(z/radius), 2)
        geometry['normals'].append([theta, phi])

    for p in polygons:
        geometry['faces'].append([n for n in p.vertices])

    for v in vertices:
        geometry['vertices'].append([round(c, 2) for c in v.co])

    full_path = os.path.join(SAVE_PATH, name) + '.json'
    with open(full_path, mode='w', encoding='utf8') as fout:
        json.dump(geometry, fout)
        fout.close()
        print('wrote ' + full_path)

