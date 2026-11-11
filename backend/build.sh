#!/usr/bin/env bash
# Script de build para plataformas como Render / Railway.
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
