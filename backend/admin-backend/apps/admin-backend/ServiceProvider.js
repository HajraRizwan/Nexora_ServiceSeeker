// import mongoose from 'mongoose';

// // Single connection to providerDB
// const providerConnection = mongoose.createConnection(
//   'mongodb://127.0.0.1:27017/providerDB',
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );

// // ServiceProvider schema
// const serviceProviderSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   contactNumber: String,
//   cnicNumber: String,
//   status: { type: String, default: 'pending' },
//   profilePhoto: String,
//   cnicFront: String,
//   cnicBack: String,
//   criminalClearance: String,
// }, { timestamps: true });

// export const ServiceProvider = providerConnection.model('ServiceProvider', serviceProviderSchema);

// // Skills schema
// const skillsSchema = new mongoose.Schema({
//   providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
//   category: String,
//   subcategories: [String],
// }, { timestamps: true });

// export const Skills = providerConnection.model('Skills', skillsSchema);

// // Certificates schema
// const certificateSchema = new mongoose.Schema({
//   providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
//   title: String,
//   fileUrl: String,
// }, { timestamps: true });

// export const Certificates = providerConnection.model('Certificates', certificateSchema);
