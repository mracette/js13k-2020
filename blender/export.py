import bpy
import os
import json
import pprint
import math

# blender /Users/markracette/Drive/Dev/blender/projects/js13k/2020/grass.blend --background --python /Users/markracette/Drive/Dev/projects/js13k/2020/blender/export.py
OBJECT_NAMES = ['player_face_lower', 'player_face_upper']
# OBJECT_NAMES = 'all'
BLENDER_PROJECT_PATH = "/Users/markracette/Drive/Dev/blender/projects/js13k/2020/grass.blend"
SAVE_PATH = "/Users/markracette/Drive/Dev/projects/js13k/2020/src/entities/geometries"

if OBJECT_NAMES == 'all':
    OBJECT_NAMES = [name[:name.find('.')] for name in os.listdir(SAVE_PATH)]
    print(OBJECT_NAMES)

for name in OBJECT_NAMES:

    mesh = bpy.data.objects[name]
    polygons = mesh.data.polygons

    vertices = mesh.data.vertices

    geometry = {
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

