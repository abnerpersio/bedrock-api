import mongoose from 'mongoose';

import './User';
import './Safe';
import './Secret';

export const User = mongoose.model('User');
export const Safe = mongoose.model('Safe');
export const Secret = mongoose.model('Secret');
