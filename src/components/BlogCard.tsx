import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category?: string;
}

const BlogCard = ({ id, title, excerpt, imageUrl, date, category }: BlogCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
      <Link to={`/news/${id}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-sm text-neutral mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
          {category && (
            <>
              <span className="mx-2">•</span>
              <span className="text-primary">{category}</span>
            </>
          )}
        </div>
        <Link to={`/news/${id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-neutral-dark mb-4 line-clamp-3 flex-grow">{excerpt}</p>
        <Link 
          to={`/news/${id}`} 
          className="text-primary font-medium hover:underline mt-auto inline-block"
        >
          Прочети повече
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
