

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../KEYS").KEYS; }

/**
 * Contact - represents a player contact for mailbox.
 */
export class Contact {
    public static contacts: Array<Contact> = [];
    public static unlisted: Array<Contact> = [];

    public firstname: string;
    public lastname: string;
    public pic: string;
    public userid: number;
    public friend: boolean;
    public picClass: any = null;

    constructor(userId: string, data: Record<string, any>, isUnlisted: boolean = false) {
        this.userid = parseInt(userId);
        this.firstname = data.first_name;
        this.lastname = data.last_name;
        this.pic = data.pic_square;
        if (!isUnlisted && !Contact.contactWithUserId(this.userid)) {
            Contact.contacts.push(this);
        } else if (isUnlisted && !Contact.contactWithUserId(this.userid)) {
            Contact.unlisted.push(this);
        }
        this.friend = data.friend === 1;
    }

    public static contactWithUserId(userId: number, includeUnlisted: boolean = false): Contact | null {
        const searchList: Array<Contact> = includeUnlisted ? Contact.contacts.concat(Contact.unlisted) : Contact.contacts;
        for (const contact of searchList) {
            if (contact.userid === userId) {
                return contact;
            }
        }
        return null;
    }

    public toString(): string {
        return getKEYS().Get("contact_tostring", {
            "v1": this.lastname,
            "v2": this.firstname,
            "v3": this.userid
        });
    }
}
