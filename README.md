
# GearDash ⚙️

GearDash is a mobile application built with React Native and Expo that helps users manage their vehicle maintenance records. It allows easy tracking, viewing, and organizing of past maintenance activities such as oil changes, tire replacements, and more.

---

## 📲 Features

| Feature                        | Description                                      |
|-------------------------------|--------------------------------------------------|
| **User Authentication**       | Login & register using Supabase Auth            |
| **Profile**                   | View and edit profile details and photo         |
| **Maintenance Management**    | Create, read, update and delete maintenance logs|
| **Favorites**                 | Mark important maintenance as favorites         |
| **Role-Based Access**         | Common user and admin support                   |
| **Detail View**               | Rich maintenance details with icons & layout    |
| **Secure Access**             | Users only access their own records             |
| **RESTful API**               | Communication via Supabase REST API             |
| **Responsive UI**             | Modern and adaptive UI for mobile screens       |

---

## 🧱 Tech Stack

| Layer         | Technology             |
|---------------|------------------------|
| **Frontend**  | React Native (Expo)    |
| **Backend**   | Supabase               |
| **Auth**      | Supabase Auth          |
| **Database**  | Supabase PostgreSQL    |
| **Storage**   | Supabase + local       |
| **Routing**   | Expo Router            |

---

## ⚙️ Installation

### 1. **Clone the repository**

```bash
git clone https://github.com/ezezz7/Gear-Dash.git
cd Gear-Dash
````

### 2. **Install dependencies**

```bash
yarn install
```

### 3. **Start the development server**

```bash
yarn start
```

---

## 🧪 Usage

1. Create an account or login.
2. Register your first maintenance with title, cost, date, etc.
3. Access the profile tab to update your data or logout.
4. Mark your favorite maintenances.
5. Tap on a maintenance to see detailed view.
6. Admins have extended access and management features.

---

## 🔐 Roles & Permissions

* `user`: can manage only their own maintenances.
* `admin`: can manage all users and records (future scalability).
* Role is defined in the `profiles` table under the `role` column.

---

## 🧩 Folder Structure

```
app/
├── (tabs)/                  # Tabbed navigation (home, profile, favorites)
│   ├── index.tsx            # List of maintenances
│   ├── profile.tsx          # User profile view & edit
│   └── favorites.tsx        # Favorite items
├── login.tsx                # Authentication screen
├── create-maintenance.tsx   # Create new maintenance
├── maintenance-details.tsx  # Detail and delete
├── edit-maintenance.tsx     # Edit existing record
```


