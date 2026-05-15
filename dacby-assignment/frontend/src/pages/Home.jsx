import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function Home() {

  const API =
    import.meta.env.VITE_API_URL;

  const [stories, setStories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [visibleCount, setVisibleCount] =
    useState(5);

  useEffect(() => {

    fetchStories();

  }, []);

  const fetchStories = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/api/stories`
      );

      console.log(res.data);

      setStories(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const bookmarkStory = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.post(
        `${API}/api/stories/${id}/bookmark`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message
      );

      fetchStories();

    } catch (error) {

      console.log(error);

      toast.error(
        "Login First"
      );
    }
  };

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const filteredStories =
    stories.filter((story) =>
      story.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const visibleStories =
    filteredStories.slice(
      0,
      visibleCount
    );

  return (
    <>
      <Navbar />

      <div className="container">

        <h1 className="title">
          📝 Blog Website
        </h1>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {loading ? (

          <>
            {[1, 2, 3].map((item) => (

              <div
                className="skeleton-card"
                key={item}
              >

                <div className="skeleton title-skeleton"></div>

                <div className="skeleton text-skeleton"></div>

                <div className="skeleton text-skeleton short"></div>

                <div className="skeleton button-skeleton"></div>

              </div>
            ))}
          </>

        ) : (

          filteredStories.length === 0 ? (

            <h2 className="empty-message">
              No blogs found 😢
            </h2>

          ) : (

            <>
              {visibleStories.map(
                (story) => {

                const isBookmarked =
                  story.bookmarkedBy?.includes(
                    user?._id
                  );

                return (

                  <div
                    className="card"
                    key={story._id}
                  >

                    <h2>
                      {story.title}
                    </h2>

                    <p>
                      <strong>
                        Author:
                      </strong>{" "}
                      {story.author}
                    </p>

                    <p>
                      <strong>
                        Points:
                      </strong>{" "}
                      {story.points}
                    </p>

                    <a
                      href={story.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read Blog
                    </a>

                    <br />

                    <button
                      className={
                        isBookmarked
                          ? "bookmarked-btn"
                          : ""
                      }

                      onClick={() =>
                        bookmarkStory(
                          story._id
                        )
                      }
                    >
                      {isBookmarked
                        ? "✅ Bookmarked"
                        : "⭐ Bookmark"}
                    </button>

                  </div>
                );
              })}

              {visibleCount <
                filteredStories.length && (

                <div className="load-more-box">

                  <button
                    className="load-more-btn"
                    onClick={() =>
                      setVisibleCount(
                        visibleCount + 5
                      )
                    }
                  >
                    Load More
                  </button>

                </div>
              )}

            </>
          )
        )}

      </div>
    </>
  );
}

export default Home;