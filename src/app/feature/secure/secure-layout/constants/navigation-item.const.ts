import { NavigationItem } from "../models";

export const NavigationItems: NavigationItem[] = [
    // {
    //     text: 'Dashboard',
    //     url: 'dashboard'
    // },
    // {
    //     text: 'Dev Guide',
    //     url: 'dev-guide'
    // }

    {
        displayName: 'Routed Chat',
        url: '/routedChat',
        icon: 'chat',
        subMenu: false,
        disable: false,
        subMenuList: [],
        
    }
    ,
    {
        displayName: 'Review Board',
        url: '/reviewBoard',
        icon: 'trending_up',
        subMenu: false,
        disable: false,
        subMenuList: [],
       

    },
    {
        displayName: 'Chats',
        url: '/supervising',
        icon: 'supervisor_account',
        subMenu: false,
        disable:false,
        subMenuList: [],
        

    },
    {
        displayName: 'General Settings',
        url: 'null',
        icon: 'admin_panel_settings',
        subMenu: false,
        disable : true,
        subMenuList: [
            // {
            //     displayName: 'User',
            //     url: '/admin/userList',
            //     icon: 'person',
            //     subMenu: false,
            //     subMenuList: [],
            //     disable: false
        
            // },
            {
                displayName: 'Group',
                url: '/admin/group',
                icon: 'group_work',
                subMenu: false,
                subMenuList: [],
                disable :false
        
            },
            {
                displayName: 'Tags',
                url: '/admin/tags',
                icon: 'bookmark_added',
                subMenu: false,
                subMenuList: [],
                disable :false
        
            },
            {
                displayName: 'Quick Replies',
                url: '/admin/quickReplies',
                icon: 'quickreply',
                subMenu: false,
                subMenuList: [],
                disable :false
        
            },
            {
                displayName: 'Holiday',
                url: '/holiday',
                icon: 'holiday_village',
                subMenu: false,
                subMenuList: [],
                disable :false
        
            },
            // {
            //     displayName: 'Business',
            //     url: '/admin/business',
            //     icon: 'business_center',
            //     subMenu: false,
            //     subMenuList: [],
            //     disable :false
        
            // }
        ],
       

    },
    {
        displayName: 'Knowledge Base',
        url: '/knowledgeBase',
        icon: 'dns',
        subMenu: false,
        disable: false,
        subMenuList: [],
        
    }
];