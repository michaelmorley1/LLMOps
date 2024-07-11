import sqlite3

def print_users():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Query the users table
    cursor.execute('SELECT * FROM users')
    rows = cursor.fetchall()
    
    if not rows:
        print("No users found.")
    else:
        print("Users Table:")
        print("ID | First Name | Surname | Gender | Height | Age | Weight | Email")
        print("-" * 80)
        for row in rows:
            # Ensure password hash is not printed for security reasons
            print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} | {row[6]} | {row[7]}")
    
    conn.close()

if __name__ == '__main__':
    print_users()
