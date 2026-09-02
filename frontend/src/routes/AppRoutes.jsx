import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";

import AdminLayout from "../layout/AdminLayout";

import AdminDashboard from "../admin/Dashboard";
import Categories from "../admin/Categories";
import Quizzes from "../admin/Quizzes";
import Questions from "../admin/Questions";
import Leaderboard from "../admin/Leaderboard";
import StudentDashboard from "../student/Dashboard";
import QuizInstructions from "../student/QuizInstructions";
import AttemptQuiz from "../student/AttemptQuiz";
import Result from "../student/Result";
import History from "../student/History";
import Results from "../admin/Results";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ---------------- ADMIN ---------------- */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="categories"
                        element={<Categories />}
                    />

                    <Route
                        path="quizzes"
                        element={<Quizzes />}
                    />

                    <Route
                        path="questions"
                        element={<Questions />}
                    />
                    <Route

                        path="results"

                        element={<Results />}

                    />
                    <Route

                        path="leaderboard"

                        element={<Leaderboard />}

                    />
                </Route>

                {/* ---------------- STUDENT ---------------- */}

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/quiz/:quizId"
                    element={
                        <ProtectedRoute role="student">
                            <QuizInstructions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/attempt/:attemptId"
                    element={
                        <ProtectedRoute role="student">
                            <AttemptQuiz />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/result/:attemptId"
                    element={
                        <ProtectedRoute role="student">
                            <Result />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/history"
                    element={
                        <ProtectedRoute role="student">
                            <History />
                        </ProtectedRoute>
                    }
                />

                {/* ---------------- 404 ---------------- */}

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;