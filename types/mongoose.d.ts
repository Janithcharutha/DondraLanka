// import mongoose from 'mongoose'

// declare global {
//   var mongoose: {
//     conn: mongoose.Connection | null
//     promise: Promise<mongoose.Connection> | null
//   } | undefined
// }

import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

export {}