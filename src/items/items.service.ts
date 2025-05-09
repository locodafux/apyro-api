import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../firebase/firebase-admin';

@Injectable()
export class ItemsService {
  private collection = db.collection('items');

  async findAll() {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) {
        return { message: 'No items found' };
      }
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw new InternalServerErrorException('Failed to fetch items');
    }
  }

  async findOne(id: string) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Item with ID '${id}' not found`);
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching item:', error);
      throw new InternalServerErrorException('Failed to fetch item');
    }
  }

  async create(data: any) {
    try {
      const docRef = await this.collection.add(data);
      return { id: docRef.id, message: 'Item created successfully' };
    } catch (error) {
      console.error('Error creating item:', error);
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async update(id: string, data: any) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundException(`Item with ID '${id}' not found`);
      }

      await docRef.update(data);
      return { id, message: 'Item updated successfully' };
    } catch (error) {
      console.error('Error updating item:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to update item',
      );
    }
  }

  async delete(id: string) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundException(`Item with ID '${id}' not found`);
      }

      await docRef.delete();
      return { id, message: 'Item deleted successfully' };
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new InternalServerErrorException('Failed to delete item');
    }
  }
}
