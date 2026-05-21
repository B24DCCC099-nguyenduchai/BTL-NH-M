const { sequelize, User, Post, Comment, Tag } = require('../models');
const { hashPassword } = require('./password');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const usersData = [
    { name: 'Alice Nguyen', email: 'alice@example.com', password: '123456', role: 'student' },
    { name: 'Bob Tran', email: 'bob@example.com', password: '123456', role: 'student' },
    { name: 'Admin Học viện', email: 'admin@example.com', password: '123456', role: 'admin' },
  ];

  const users = await Promise.all(
    usersData.map((user) =>
      User.findOrCreate({
        where: { email: user.email },
        defaults: {
          name: user.name,
          email: user.email,
          passwordHash: hashPassword(user.password),
          role: user.role,
        },
      }).then((result) => result[0])
    )
  );

  const [alice, bob, admin] = users;

  const tags = await Promise.all(
    [
      { name: 'Frontend' },
      { name: 'Backend' },
      { name: 'UmiJS' },
      { name: 'React' },
    ].map((tagData) => Tag.findOrCreate({ where: { name: tagData.name } }).then((result) => result[0])))
  );

  const [frontendTag, backendTag] = tags;

  const posts = await Promise.all(
    [
      {
        title: 'Cách tạo thread comment trong React',
        content:
          'Mình cần xây dựng hệ thống bình luận có reply theo luồng. Ai có ví dụ hoặc gợi ý thì share với nhé.',
        authorId: alice.id,
        views: 128,
        answersCount: 2,
      },
      {
        title: 'Cấu hình dark mode cho Ant Design + UmiJS',
        content:
          'Dark mode trong forum cần giữ được hiệu ứng nhẹ nhàng và dễ đọc. Mọi người có cách triển khai bằng CSS/LESS không?',
        authorId: bob.id,
        views: 84,
        answersCount: 1,
      },
    ].map((postData) =>
      Post.findOrCreate({ where: { title: postData.title }, defaults: postData }).then((result) => result[0])
    )
  );

  const [post1, post2] = posts;
  await post1.addTag(frontendTag);
  await post2.addTag(backendTag);

  const comment1 = await Comment.findOrCreate({
    where: {
      content: 'Bạn có thể dùng cây comment kèm parentId để hiển thị đệ quy.',
      postId: post1.id,
      authorId: bob.id,
    },
    defaults: {
      content: 'Bạn có thể dùng cây comment kèm parentId để hiển thị đệ quy.',
      postId: post1.id,
      authorId: bob.id,
      votes: 3,
    },
  }).then((result) => result[0]);

  const comment2 = await Comment.findOrCreate({
    where: {
      content: 'Thêm một lớp theme biến và lưu trạng thái vào localStorage là ổn.',
      postId: post2.id,
      authorId: alice.id,
    },
    defaults: {
      content: 'Thêm một lớp theme biến và lưu trạng thái vào localStorage là ổn.',
      postId: post2.id,
      authorId: alice.id,
      votes: 2,
    },
  }).then((result) => result[0]);

  await Comment.findOrCreate({
    where: {
      content: 'Mình đồng ý, nên thêm nút chuyển chế độ ngay header.',
      postId: post2.id,
      authorId: admin.id,
      parentCommentId: comment2.id,
    },
    defaults: {
      content: 'Mình đồng ý, nên thêm nút chuyển chế độ ngay header.',
      postId: post2.id,
      authorId: admin.id,
      parentCommentId: comment2.id,
      votes: 1,
    },
  });

  console.log('Seed dữ liệu forum đã hoàn thành.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Lỗi khi seed dữ liệu:', error);
  process.exit(1);
});
