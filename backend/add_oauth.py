import codecs
content = codecs.open('main.py', 'r', encoding='utf-8').read()

new_routes = '''
@app.get("/api/meta/oauth/url")
def get_meta_oauth_url():
    app_id = os.getenv("FB_APP_ID")
    redirect_uri = "http://localhost:5173/meta/callback"
    scope = "ads_management,pages_show_list,pages_read_engagement"
    url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}"
    return {"url": url}

class OAuthCallback(BaseModel):
    code: str

@app.post("/api/meta/oauth/callback")
def meta_oauth_callback(payload: OAuthCallback, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = os.getenv("FB_APP_ID")
    app_secret = os.getenv("FB_APP_SECRET")
    redirect_uri = "http://localhost:5173/meta/callback"
    
    # 1. Exchange code for access token
    token_url = f"https://graph.facebook.com/v18.0/oauth/access_token?client_id={app_id}&redirect_uri={redirect_uri}&client_secret={app_secret}&code={payload.code}"
    token_res = requests.get(token_url)
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token from Meta")
    
    token_data = token_res.json()
    access_token = token_data.get("access_token")
    
    # 2. Get user info
    me_url = f"https://graph.facebook.com/me?access_token={access_token}"
    me_res = requests.get(me_url)
    if me_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user info from Meta")
        
    me_data = me_res.json()
    
    # 3. Save to database
    current_user.meta_access_token = access_token
    current_user.meta_account_id = me_data.get("id")
    current_user.meta_account_name = me_data.get("name")
    db.commit()
    
    return {"success": True, "account_name": current_user.meta_account_name}
'''

content = content + new_routes
codecs.open('main.py', 'w', encoding='utf-8').write(content)
print('done')
