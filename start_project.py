import subprocess
import os

project_root = os.getcwd()
backend_path = os.path.join(project_root, "backend")
frontend_path = os.path.join(project_root, "frontend")
venv_activate = os.path.join(backend_path, "stock_market_venv`", "Scripts", "activate.bat")  # Using backticks as per your requirement
manage_py = os.path.join(backend_path, "manage.py")

print(f"Project Root: {project_root}")
print(f"Backend Path: {backend_path}")
print(f"Frontend Path: {frontend_path}")
print(f"Virtual Environment Activation Script: {venv_activate}")
print(f"Manage.py Path: {manage_py}")

if not os.path.exists(backend_path):
    print("Error: Backend path does not exist!")
    exit(1)

if not os.path.exists(venv_activate):
    print("Error: Virtual environment activation script not found!")
    exit(1)

if not os.path.exists(manage_py):
    print("Error: manage.py not found in backend folder!")
    exit(1)

print("\nStarting Django backend...")
django_cmd = f'cmd /k "cd /d {backend_path} && call {venv_activate} && python manage.py runserver"'
print(f"Executing: {django_cmd}")
subprocess.Popen(django_cmd, shell=True)

print("\nStarting Angular frontend...")
angular_cmd = f'cmd /k "cd /d {frontend_path} && npx ng serve --port 4300 --open"'
print(f"Executing: {angular_cmd}")
subprocess.Popen(angular_cmd, shell=True)

print("\nBoth servers are running in separate terminal windows.")
