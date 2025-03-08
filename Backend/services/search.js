const Course = require('../models/Course')

class SearchService {
  async searchCourses(query) {
    const {
      search,
      category,
      priceMin,
      priceMax,
      rating,
      sort,
      page = 1,
      limit = 10
    } = query

    let filter = {}

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Category filter
    if (category) {
      filter.category = category
    }

    // Price range
    if (priceMin || priceMax) {
      filter.price = {}
      if (priceMin) filter.price.$gte = priceMin
      if (priceMax) filter.price.$lte = priceMax
    }

    // Rating filter
    if (rating) {
      filter['ratings.average'] = { $gte: parseFloat(rating) }
    }

    // Sorting
    let sortOption = {}
    switch (sort) {
      case 'price_asc':
        sortOption.price = 1
        break
      case 'price_desc':
        sortOption.price = -1
        break
      case 'rating':
        sortOption['ratings.average'] = -1
        break
      case 'newest':
        sortOption.createdAt = -1
        break
      default:
        sortOption.createdAt = -1
    }

    const skip = (page - 1) * limit

    const courses = await Course.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'name avatar')

    const total = await Course.countDocuments(filter)

    return {
      courses,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  }
}

module.exports = new SearchService() 