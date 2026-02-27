import requests

# 1. Login to get token
login_res = requests.post('http://localhost:8000/api/auth/login', json={"email": "c@gmail.com", "password": "12345678"})
print("Login:", login_res.status_code)
if login_res.status_code == 200:
    token = login_res.json()['data']['session']['access_token']
    
    # 2. Get workspaces
    r = requests.get('http://localhost:8000/api/workspaces', headers={'Authorization': f'Bearer {token}'})
    print("Workspaces Status:", r.status_code)
    try:
        print(r.json())
    except:
        print("Raw Error:", r.text)

