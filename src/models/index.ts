import mongoose from 'mongoose';

import './user';
import './safe';
import './secret';

export const User = mongoose.model('User');
export const Safe = mongoose.model('Safe');
export const Secret = mongoose.model('Secret');
