export type SourceType = 'checkin' | 'message' | 'sighting' | 'note' | 'tip';

export interface BaseRecord {
  id: string;
  sourceType: SourceType;
  timestamp: string;
  personName?: string;
  location?: string;
  coordinates?: string;
  content?: string;
  relatedPersons?: string[];
}

export interface Checkin extends BaseRecord {
  sourceType: 'checkin';
  location: string;
  note?: string;
}

export interface Message extends BaseRecord {
  sourceType: 'message';
  senderName: string;
  recipientName: string;
  text: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Sighting extends BaseRecord {
  sourceType: 'sighting';
  witnessName: string;
  description: string;
}

export interface PersonalNote extends BaseRecord {
  sourceType: 'note';
  author: string;
  text: string;
}

export interface AnonymousTip extends BaseRecord {
  sourceType: 'tip';
  text: string;
  reliability: 'high' | 'medium' | 'low';
}

export type AnyRecord = Checkin | Message | Sighting | PersonalNote | AnonymousTip;

export interface Person {
  id: string;
  name: string;
  linkedRecords: AnyRecord[];
  suspicionScore: number;
  lastSeenLocation?: string;
  lastSeenAt?: string;
}
