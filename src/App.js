import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import fetchImages from './services/imageAPI';

import { Searchbar } from './components/Searchbar/Searchbar';
import { Spiner } from './components/Loader/Spiner';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Button } from './components/Button/Button';
import { Modal } from './components/Modal/Modal';

import { Container } from './App.styles';

const App = () => {
    const [page, setPage] = useState(1);
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [largeImage, setLargeImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

      useEffect(() => {
    if (searchQuery.trim() === '') {
      return;
    }
    requestFetch();
  }, [searchQuery, page]);

  const requestFetch = () => {
    setIsLoading(true);
    fetchImages(searchQuery, page)
      .then(data => {
        setImages([...images, ...data.hits]);
        if (data.hits.length > 0) {
          toast.success('request completed');
          if (page > 1) {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
          }
        } else {
          toast.error('No images found on request');
        }
      })
      .catch(er => {
        setError(er);
        toast.error(error);
      })
      .finally(() => setIsLoading(false));
    };
    
      const handleFormSubmit = searchQuery => {
        setSearchQuery(searchQuery.trim());
        setPage(1);
        setImages([]);
    };

    const openModal = largeImageURL => {
        setShowModal(true);
        setLargeImage(largeImageURL);
    };

    const toggleModal = () => {
        setShowModal(false);
        setLargeImage('');
    };

    return (
        <Container>
            <Searchbar onSubmit={handleFormSubmit} />

            {isLoading === true && <Spiner />}
            <>
                <ImageGallery images={images} openModal={openModal} />

                {images.length > 0 && <Button onClick={fetchImages} />}
            </>

            {showModal && (
                <Modal onClose={toggleModal}>
                    <img src={largeImage} alt="" />
                </Modal>
            )}
            <ToastContainer />
        </Container>
    );
};

export default App;