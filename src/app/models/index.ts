import mongoose from 'mongoose';

import './safe';
import './secret';
import './user';

export const User = mongoose.model('User');
export const Safe = mongoose.model('Safe');
export const Secret = mongoose.model('Secret');
