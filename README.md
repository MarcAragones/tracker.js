# Tracker.js

This library is a simple time tracker.

## Usage

This is the basic usage:

```javascript
// Create a session
session = new Session({ name: 'name1' })

// Start recording
session.start()

// Stop recording
session.stop()

// Save the results
session.save()
```

The sessions are stored in the browser using `localStorage`.

To get an overview of the stored sessions:

```javascript
overview = new Overview()
overview.get()
// {
// 	month: {
// 		count: 101,
// 		maxLength: 60128,
// 		minLength: 1039,
// 		sample: [Session, Session, Session]
// 	},
// 	week: {
// 		count: 24,
// 		maxLength: 60128,
// 		minLength: 2398,
// 		sample: [Session, Session, Session]
// 	},
// 	day: {
// 		count: 2,
// 		maxLength: 25094,
// 		minLength: 1129,
// 		sample: [Session, Session, Session]
// 	}
// }
```
