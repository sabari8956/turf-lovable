import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TurfCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  price: number;
  availableSlots: number;
}

export function TurfCard({ id, name, location, image, description, price, availableSlots }: TurfCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <CardHeader className="p-0">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-2">{name}</CardTitle>
        <p className="text-sm text-secondary mb-4">{location}</p>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">${price}/hour</span>
          <span className="text-sm text-secondary">{availableSlots} slots available</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link to={`/turf/${id}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}