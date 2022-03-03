import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import ConnectDB from './config/db.js'

dotenv.config()

ConnectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers.find((user) => user.isAdmin)._id
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }))
    await Product.insertMany(sampleProducts)

    console.log('Data imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`${error.message}`.red.inverse)
    process.exit(1)
  }
}

const clearData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(`${error.message}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  clearData()
} else {
  importData()
}
