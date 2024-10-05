function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(2));
}
module.exports = calculateAverageRating;
