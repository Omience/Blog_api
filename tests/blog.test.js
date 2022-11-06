const blog = require("../controllers/blogController")

test('getAllBlogs should return only the published blogs', () => {
    expect({state:"published"})
});

