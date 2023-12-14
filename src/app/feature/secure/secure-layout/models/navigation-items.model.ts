export interface NavigationItem {
    displayName: string;
    url: string;
    icon:string;
    subMenu:boolean;
    subMenuList: NavigationItem[],
    disable: boolean;
    
}