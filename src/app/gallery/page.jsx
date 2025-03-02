import MasonryGallery from "@/components/MasonryGallery";

export default function Gallery() {
  const images = [
    {
      name: "Mont Blanc, France/Italy",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVqx4zXtkyXF9uJRjlwRGnHEJH0_hGR1GSyw&s",
    },
    {
      name: "Mount Everest, Nepal/Tibet",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Mount_Everest_as_seen_from_Drukair2_PLW_edit_Cropped.jpg",
    },

    {
      name: "Matterhorn, Switzerland/Italy",
      image: "https://57hours.com/wp-content/uploads/2023/02/climbing-the-matterhorn-zermatt-768x432.jpg",
    },
    {
      name: "Denali, USA (Alaska)",
      image: "https://cdn.britannica.com/30/2430-050-BB396B1E/Denali-Alaska.jpg",
    },


    {
      name: "Mount Kilimanjaro, Tanzania",
      image: "https://www.climbing-kilimanjaro.com/wp-content/uploads/2020/11/Mount-Kilimanjaro-Meaning.jpg",
    },
    {
      name: "Mount Fuji, Japan",
      image: "https://media.cnn.com/api/v1/images/stellar/prod/230908155626-05-mount-fuji-overtourism.jpg?c=original",
    },
    {
      name: "Aconcagua, Argentina",
      image: "https://www.andeantrails.co.uk/wp-content/uploads/2017/02/aconcagua-peak-argentina.jpg",
    },
    {
      name: "K2, Pakistan/China",
      image: '/download.png',
    },
    {
      name: "Kangchenjunga, India/Nepal",
      image: "https://www.tranquilkilimanjaro.com/wp-content/uploads/kangchenjunga.jpeg",
    },
    {
      name: "Mount Vinson, Antarctica",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR41E30Ke3EjZtZqeTFtjXz3f3073jLaJT9qw&s",
    },
    {
      name: "Mount Elbrus, Russia",
      image: "https://cdn.mos.cms.futurecdn.net/F89hZTBM68FmFCPVEfmkA8.jpg",
    },
    {
      name: "Table Mountain, South Africa",
      image: "https://cdn.thecollector.com/wp-content/uploads/2024/06/table-mountain-purple.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-6">Image Gallery</h1>
      <MasonryGallery images={images} />
    </div>
  );
}
