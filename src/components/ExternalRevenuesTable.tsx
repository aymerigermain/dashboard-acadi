import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { ExternalRevenue } from '../types';

interface ExternalRevenuesTableProps {
  purchases: ExternalRevenue[];
}

const ExternalRevenuesTable: React.FC<ExternalRevenuesTableProps> = ({ purchases }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Format date from ISO to DD/MM/YYYY
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            backgroundColor: '#64748b',
            borderRadius: 2,
          }}
        />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '1.125rem',
          }}
        >
          Achats Licences Hors Plateforme
        </Typography>
      </Box>

      {purchases.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
            mt: 2,
          }}
        >
          <Typography color="text.secondary">
            Aucun achat externe enregistré
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 500, border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  Produit
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Prix Unitaire
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Quantité
                    </TableCell>
                  </>
                )}
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  Acheteur
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Contact Formateur
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Contact Financeur
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      Cadre
                    </TableCell>
                  </>
                )}
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  Date
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                    Remarques
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'grey.50',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      '& .MuiTableCell-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {purchase.produit}
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(purchase.prixUnitaire)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={purchase.quantite}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: 'success.main' }}
                    >
                      {formatCurrency(purchase.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {purchase.acheteur || '-'}
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>
                        <Typography variant="body2">
                          {purchase.contactFormateur || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {purchase.contactFinanceur || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {purchase.cadre || '-'}
                        </Typography>
                      </TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(purchase.date)}
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={purchase.remarques || '-'}
                      >
                        {purchase.remarques || '-'}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ExternalRevenuesTable;
