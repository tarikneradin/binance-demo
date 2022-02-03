import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center' }}>
      <Link color="inherit" href="http://www.tarikneradin.tech/">
        {'Copyright © '}
        Tarik Neradin
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
