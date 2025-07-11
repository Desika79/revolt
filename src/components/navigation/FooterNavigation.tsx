import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';

interface FooterNavigationProps {
  onRoomsClick: () => void;
  onIndividualsClick: () => void;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  onRoomsClick,
  onIndividualsClick
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ambient-secondary/90 backdrop-blur-sm border-t border-whisper-mist">
      <div className="flex items-center justify-center gap-8 p-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={onRoomsClick}
          className="flex flex-col items-center gap-2 h-auto py-3 px-6 text-cyber-cyan hover:bg-whisper-mist/20 hover:text-cyber-cyan"
        >
          <Users className="h-6 w-6" />
          <span className="text-sm font-medium">Rooms</span>
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          onClick={onIndividualsClick}
          className="flex flex-col items-center gap-2 h-auto py-3 px-6 text-cyber-purple hover:bg-whisper-mist/20 hover:text-cyber-purple"
        >
          <User className="h-6 w-6" />
          <span className="text-sm font-medium">Individuals</span>
        </Button>
      </div>
    </div>
  );
};

export default FooterNavigation;