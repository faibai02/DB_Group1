
import { FoodItem, Order } from './types';

export const COLORS = {
  primary: '#ec8013',
  secondary: '#f3ede7',
  textPrimary: '#1b140d',
  textSecondary: '#9a734c',
  bg: '#fcfaf8',
};

export const MOCK_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Spicy Chicken Tacos',
    description: 'Authentic Mexican tacos with a spicy kick and fresh salsa.',
    price: 12.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtXWzedZ-CJedovOippe95-_UExnwzljBa8pW8Fbgs1Z16VZ2YdzCfYH-6FQp02ep50k2lblEXeBFKAxGA-V288JeY3aeZs_f74bKre3TybB9DnIs5B99zGWvJudJoxsAVW56jeyepUxUpbTFgJpyubRGaZ-drRsqZ-YaGL6cR1PNUfPveC8QOfKFs8OdIQgwyaRv3wmIVK7PpAeKvasDtjsHmaikB38Z9rMZfT4khf8RBa8wpKo_E6_wLzuZS2s51cjjCA5pjojk',
    category: 'Tacos',
    restaurant: 'Taco Town',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    name: 'Vegan Burger',
    description: 'Plant-based burger with all the fixings and a whole grain bun.',
    price: 14.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-DD9cxOwMxTUq6Y9h5Cnmx7Ct3GPqVec9cQTDkwvQVZT96qolBIKRhtM-Os461DWjzNLdsaR3mXleyZf4oTpoBbH7Vzw87WfpgSoiKMqJ16PcN3pqro_kqx2PpiiTHYfSz-lwpk1o6qFC48PwEC8Tlj-EcBcIPw9tlnAbRlLPnfn1IE_Htb1Rdbyft0SkerS8Fr05YBqVeijDYS2FYS0K_fEhs7FsNXjaZYQnaHXYV_EIIQE3jjQsKFIkxq_v9tM1FK58LVk115g',
    category: 'Burgers',
    restaurant: 'Burger Barn',
    rating: 4.5,
    reviews: 89
  },
  {
    id: '3',
    name: 'Classic Beef Burger',
    description: 'Our signature handcrafted beef patty, grilled to perfection. Served on a toasted brioche bun.',
    price: 12.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fYbgEs-fsR4V9lh6DSxppm9xlTeaTGS8ifJquDrDx-SD-zDTZ8qUQkWAcGIzbDmdBhthQ2w1oRjEtHBwQKxKs5aFpO53g5JS21555r5wEs4CRFYctO4zFB7ogP31mNQYKHMAigwbxqa6Jy2RA3ad37ghe5_TVFINb9PLl67R7MngOid4RwXKwEnVISRDel1QhdE8YIUEoJuMfH8cFoa9Q0RLy2VNlhdf0VVS_kvvO7ZbddKPAPBn08puOMvNQ_wDxGJsdKAdflw',
    category: 'Burgers',
    restaurant: 'Daily Yamazaki',
    rating: 4.9,
    reviews: 128
  },
  {
    id: '4',
    name: 'Sushi Combo',
    description: 'Assorted sushi rolls and sashimi, made with fresh daily catch.',
    price: 18.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnwLWBznakGez-nX3ct-HC5W3YwBd2ceD9YuD8NfyDBltSKQP3bbC0X_4mrz3hf3Bo3lOL5DyrlTnElXGRgh9YVcT3EH84glPGGlMKGdxZVJUT4hQQdBH1AjYDUiiL3ArEJRihaY_8vNAH2u1IKziKWjTAXhycAN-IjBjtNRJ8JJlSMd6OGS6AzRc9uVd9z-4qGEaZf-p11o2xNj2zRHXRxwSwWIutNAOuN5zgY08OlazZOZewsyvpiDZwwK8O33XdmXA26AP_KN8',
    category: 'Sushi',
    restaurant: 'Sushi Spot',
    rating: 4.7,
    reviews: 210
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-98765', date: 'July 15, 2023', restaurant: 'Pizza Palace', items: 2, total: 25.50, status: 'delivered' },
  { id: 'ORD-98764', date: 'June 20, 2023', restaurant: 'Burger Barn', items: 3, total: 32.75, status: 'delivered' },
  { id: 'ORD-98763', date: 'May 10, 2023', restaurant: 'Sushi Spot', items: 1, total: 18.99, status: 'delivered' },
];
