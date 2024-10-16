"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("usuarios", [
      {
        id: 1,
        name: "admin",
        email: "admin@admin.com",
        password: "$2a$10$N2WGjCi3EPJbmBn.fEpmAuiTej8Yph0rJ31xmjNAaiueGzrEm.9t.",
        createdByUserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
