const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		max: 25
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	collectionTitle: {
		type: [String],
		default: []
	},
	collectionId: {
		type: [String],
        default: [],
	},
    public : {
        type: Boolean,
        required: true
    },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Playlist", playlistSchema);
