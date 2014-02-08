package net.owlgroup.ea.login.bean;

public class LoginData {
    boolean isLogined;
    String remember;
    String authorization;
    GlobalSession global_session;
    UserSession user_session;
    public LoginData(){
        global_session = new GlobalSession();
        user_session = new UserSession();
    }
    public String getRemember() {
        return remember;
    }
    public void setRemember(String remember) {
        this.remember = remember;
    }
    public String getAuthorization() {
        return authorization;
    }
    public void setAuthorization(String authorization) {
        this.authorization = authorization;
    }
    public GlobalSession getGlobal_session() {
        return global_session;
    }
    public void setGlobal_session(GlobalSession global_session) {
        this.global_session = global_session;
    }
    public UserSession getUser_session() {
        return user_session;
    }
    public void setUser_session(UserSession user_session) {
        this.user_session = user_session;
    }
    public boolean isLogined() {
        return isLogined;
    }
    public void setLogined(boolean isLogined) {
        this.isLogined = isLogined;
    }
    
}
