import { Injectable } from '@nestjs/common';
import { db } from '../firebase/firebase-admin';

@Injectable()
export class ItemsService {
  private collection = db.collection('items');

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async create(data: any) {
    const docRef = await this.collection.add(data);
    return { id: docRef.id };
  }

  async update(id: string, data: any) {
    await this.collection.doc(id).update(data);
    return { id };
  }

  async delete(id: string) {
    await this.collection.doc(id).delete();
    return { id };
  }
}
