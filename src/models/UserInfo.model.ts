import pool from "../db";

class UserInfo {
  // Create a new user
  static async create(userData: any) {
    const [result] = await pool.query("insert into User_Info set ?", [
      userData,
    ]);
    return result;
  }
  // Get all users
  static async getAll() {
    const [result] = await pool.query(
      "select fname,lname,email,role,graduationYear,contact from User_Info"
    );
    return result;
  }
  // find by email
  static async findByEmail(email: string) {
    const [result] = await pool.query(
      "select fname,lname,email,role,graduationYear,contact from User_Info where email = ?",
      [email]
    );
    return result;
  }
  // find by contact
  static async findByContact(contact: string) {
    const [result] = await pool.query(
      "select fname,lname,email,role,graduationYear,contact from User_Info where contact = ?",
      [contact]
    );
    return result;
  }
  // update user
  static async updateUser(email: string, userData: any) {
    const [result] = await pool.query(
      "update User_Info set ? where email = ?",
      [userData, email]
    );
    return result;
  }

  //delete user
  static async deleteUser(email: string) {
    const [result] = await pool.query("delete from User_Info where email = ?", [
      email,
    ]);
    return result;
  }

  // get user password by email
  static async getUserPassword(email: string) {
    const [result] = await pool.query(
      "select password from User_Info where email = ?",
      [email]
    );
    return result;
  }
}

export default UserInfo;
