var map = new Map<string, Map<string, string>>([[
    "nl", new Map([
        /////////////////
        ["login_username", "Gebruikersnaam"],
        ["login_password", "Wachtwoord"],
        ["login_send", "Inloggen"],
        ["login_reset", "Wachtwoord vergeten?"],
        ["login_invalid", "Inloggen mislukt! Probeer het nogmaals!"],
        /////////////////
        ["state_title_login", "Inloggen"],
        ["state_title_notebooks", "Overzicht Notitieblokken"],
        ["state_title_chapters", "Overzicht Hoofdstukken"],
        ["state_title_notes", "Overzicht Notities"],
        ["state_title_note", "Notitie"],
        /////////////////
        ["header_icon_back", "Terug"],
        ["header_icon_unlocked", "Open"],
        ["header_icon_locked", "Gesloten"],
        ["header_icon_search", "Zoeken"],
        ["header_icon_menu", "Menu"],
        /////////////////
        ["header_menu_settings", "Instellingen"],
        ["header_menu_logout", "Uitloggen"],
        /////////////////
        ["tabmenu_empty", "Naamloos"],
        /////////////////
        ["notebooks_name", "Notitieblok"],
        ["notebooks_add", "Notitieblok"],
        /////////////////
        ["chapters_name", "Hoofdstuk"],
        ["chapters_add", "Hoofdstuk"],
        /////////////////
        ["notes_name", "Notities"],
        ["notes_add", "Notitie"]
        

    ])],[
    "en", new Map([
        ["login_username", "Username"],
        ["login_password", "Password"],
        ["login_send", "Login"],
        ["login_reset", "Forgot password?"],
        ["login_invalid", "Login failed! Please try again!"],
        /////////////////
        ["state_title_login", "Login"],
        ["state_title_notebooks", "Overview notebooks"],
        ["state_title_chapters", "Overview chapters"],
        ["state_title_notes", "Overview notes"],
        ["state_title_note", "Note"],
        /////////////////
        ["header_icon_back", "Back"],
        ["header_icon_unlocked", "Unlocked"],
        ["header_icon_locked", "Locked"],
        ["header_icon_search", "Search"],
        ["header_icon_menu", "Menu"],
        /////////////////
        ["header_menu_settings", "Settings"],
        ["header_menu_logout", "Logout"],
        /////////////////
        ["tabmenu_empty", "Empty"],
        /////////////////
        ["notebooks_name", "Notebook"],
        ["notebooks_add", "Notebook"],
        /////////////////
        ["chapters_name", "Chapter"],
        ["chapters_add", "Chapter"],
        /////////////////
        ["notes_name", "Notes"],
        ["notes_add", "Note"]
    ])],[
    "en-US", new Map([
        ["login_username", "Username"],
        ["login_password", "Password"],
        ["login_send", "Login"],
        ["login_reset", "Forgot password?"],
        ["login_invalid", "Login failed! Please try again!"],
        /////////////////
        ["state_title_login", "Login"],
        ["state_title_notebooks", "Overview notebooks"],
        ["state_title_chapters", "Overview chapters"],
        ["state_title_notes", "Overview notes"],
        ["state_title_note", "Note"],
        /////////////////
        ["header_icon_back", "Back"],
        ["header_icon_unlocked", "Unlocked"],
        ["header_icon_locked", "Locked"],
        ["header_icon_search", "Search"],
        ["header_icon_menu", "Menu"],
        /////////////////
        ["header_menu_settings", "Settings"],
        ["header_menu_logout", "Logout"],
        /////////////////
        ["tabmenu_empty", "Empty"],
        /////////////////
        ["notebooks_name", "Notebook"],
        ["notebooks_add", "Notebook"],
        /////////////////
        ["chapters_name", "Chapter"],
        ["chapters_add", "Chapter"],
        /////////////////
        ["notes_name", "Notes"],
        ["notes_add", "Note"]
    ])]
])

export default class Lang{
    private static language:string = map.get(navigator.language)!==undefined?navigator.language:"en-US";

    public static get(tag:string){
        
        return map.get(this.language).get(tag);
    }
}
