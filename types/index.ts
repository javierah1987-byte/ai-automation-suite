// @ts-nocheck
export type Lead={id?:string;name:string;address:string;phone:string;website:string;rating:number;reviews:number;score:number;sector:string;zone:string;status:string;created_at?:string;};
export type Proposal={id?:string;client_name:string;client_company:string;client_email:string;sector:string;service:string;budget:string;content:string;status:string;created_at?:string;};
export type Meeting={id?:string;title:string;transcript:string;summary:string;attendees:string[];decisions:string[];tasks:any[];mode:string;emails_sent:boolean;created_at?:string;};
export type Contact={id?:string;name:string;phone:string|null;company:string|null;email:string|null;city:string|null;notes:string|null;};
