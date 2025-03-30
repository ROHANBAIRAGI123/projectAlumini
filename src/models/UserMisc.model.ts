import pool from "../db";

class UserMisc {
  // Create a new user
  static async create(userData: any) {
    const [result] = await pool.query("insert into User_Misc set ?", [
      userData,
    ]);
    return result;
  }
  // Get all users
  static async getAll() {
    const [result] = await pool.query(
      "select branch,achievement from User_Misc"
    );
    return result;
  }
  // find by id
  static async findById(id: number) {
    const [result] = await pool.query(
      "select branch,achievement from User_Misc where id = ?",
      [id]
    );
    return result;
  }
  // update user
  static async updateUser(id: number, userData: any) {
    const [result] = await pool.query("update User_Misc set ? where id = ?", [
      userData,
      id,
    ]);
    return result;
  }
}

export default UserMisc;
