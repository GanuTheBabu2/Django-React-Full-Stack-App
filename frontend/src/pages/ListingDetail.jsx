import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import MobileNavbar from "../components/MobileNavbar.jsx";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/listings/view/${id}/`)
      .then((response) => {
        setListing(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listing:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found.</p>;

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <h2>{listing.name}</h2>
      <p>Description: {listing.description}</p>
      <p>Quantity: {listing.quantity}</p>
      <p>Cost: ₹{listing.cost}</p>
      {listing.image && <img src={listing.image} alt={listing.name} style={{ maxWidth: "100%", height: "auto" }} />}
      <p>Category: {listing.category}</p>
      <MobileNavbar />
    </div>
  );
};

export default ListingDetail;