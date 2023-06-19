import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function connect() {
	if (process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL") {
		/**
		 * Global is used here to maintain a cached connection across hot reloads
		 * in development. This prevents connections growing exponentially
		 * during API Route usage.
		 */
		let cached = global.mongoose;

		if (!cached) {
			cached = global.mongoose = { conn: null, promise: null };
		}

		if (cached.conn) {
			return cached.conn;
		}

		if (!cached.promise) {
			const opts = {
				bufferCommands: false,
			};

			mongoose.set("strictQuery", false);

			cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
				return mongoose;
			});
		}

		try {
			cached.conn = await cached.promise;
		} catch (e) {
			cached.promise = null;
			throw e;
		}

		return cached.conn;
	} else {
		const opts = {
			bufferCommands: false,
		};

		mongoose.set("strictQuery", false);

		mongoose.connect(MONGODB_URI);
		// await mongoose.connect(MONGODB_URI, opts);
	}
}

export default connect;
