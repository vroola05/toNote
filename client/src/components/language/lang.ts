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
        ["state_title_settings", "Instellingen"],
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
        ["notes_add", "Notitie"],
        /////////////////
        ["main_note_header_created", "Gemaakt"],
        ["main_note_header_modified", "Gewijzigd"],
        /////////////////
        ["settings_title", "Instellingen"],
        ["settings_cancel", "Annuleren"],
        ["settings_save", "Opslaan"],
        /////////////////
        ["date_today", "Vandaag"],
        ["date_yesterday", "Gisteren"],
        ["date_month_jan", "jan"],
        ["date_month_feb", "feb"],
        ["date_month_mar", "ma"],
        ["date_month_apr", "apr"],
        ["date_month_may", "mei"],
        ["date_month_jun", "jun"],
        ["date_month_jul", "jul"],
        ["date_month_aug", "aug"],
        ["date_month_sep", "sep"],
        ["date_month_oct", "okt"],
        ["date_month_nov", "nov"],
        ["date_month_dec", "dec"]
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
        ["state_title_settings", "Settings"],
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
        ["notes_add", "Note"],
        /////////////////
        ["settings_title", "Settings"],
        ["settings_cancel", "Cancel"],
        ["settings_save", "Save"],
        /////////////////
        ["date_today", "Today"],
        ["date_yesterday", "Yesterday"],
        ["date_month_jan", "jan"],
        ["date_month_feb", "feb"],
        ["date_month_mar", "mar"],
        ["date_month_apr", "apr"],
        ["date_month_may", "may"],
        ["date_month_jun", "jun"],
        ["date_month_jul", "jul"],
        ["date_month_aug", "aug"],
        ["date_month_sep", "sep"],
        ["date_month_oct", "oct"],
        ["date_month_nov", "nov"],
        ["date_month_dec", "dec"]
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
        ["state_title_settings", "Settings"],
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
        ["notes_add", "Note"],
        /////////////////
        ["settings_title", "Settings"],
        ["settings_cancel", "Cancel"],
        ["settings_save", "Save"],
        /////////////////
        ["date_today", "Today"],
        ["date_yesterday", "Yesterday"],
        ["date_month_jan", "jan"],
        ["date_month_feb", "feb"],
        ["date_month_mar", "mar"],
        ["date_month_apr", "apr"],
        ["date_month_may", "may"],
        ["date_month_jun", "jun"],
        ["date_month_jul", "jul"],
        ["date_month_aug", "aug"],
        ["date_month_sep", "sep"],
        ["date_month_oct", "oct"],
        ["date_month_nov", "nov"],
        ["date_month_dec", "dec"]
    ])]
])

export default class Lang{
    private static language:string = map.get(navigator.language)!==undefined?navigator.language:"en-US";

    public static get(tag:string){
        
        return map.get(this.language).get(tag);
    }
}
